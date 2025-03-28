import Types "./types/Types";
import Principal "mo:base/Principal";
import HashMap "libs/FunctionalStableHashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Time "mo:base/Time";

import Result "mo:base/Result";

shared ({ caller }) actor class Dao(name : Text, manifesto : Text, founders : [Types.DaoFounder]) = {

    type VotingStatus = Types.VotingStatus;
    type Member = Types.Member;
    type TutoId = Types.TutoId;
    type Mode = Types.Mode;
    type Publication = Types.Publication;
    type updateMembersResult = Result.Result<?Member, Text>;

    let tutoIdHash = Types.tutoIdHash;
    let tutoIdEqual = Types.tutoIdEqual;
    let principalHash = Principal.hash;
    let principalEqual = Principal.equal;

    stable let deployTimeStamp : Int = Time.now();
    stable let masterPlatform = caller; 
    stable let postsInTheVotingProcess = HashMap.init<TutoId, VotingStatus>();
    stable var votingPeriod = 259000; 

    public query func getName() : async Text { name };
    public query func getManifesto() : async Text { manifesto };
    public query func getmembersQty() : async Nat { HashMap.size(members) };

    public query func getPrincipalMembers(): async [Principal]{
        return Iter.toArray<Principal>(HashMap.keys<Principal,Member>(members));
    };

    let members = HashMap.init<Principal, Member>();

    for (founder in founders.vals()) {
        let member: Member = {
            name = founder.name;
            admissionDate = deployTimeStamp;
            enabled = true;
            votedTutoId : [TutoId] = [];
        };
        HashMap.put(members, principalEqual, principalHash, founder.principal, member)
    };

    public shared ({caller}) func isAMember() : async Bool { _isAMember(caller)};
    public shared ({caller}) func whoAmi(): async Principal {caller};

    func _isAMember(p : Principal) : Bool {
        return switch (HashMap.get(members, principalEqual, principalHash, p)) {
            case null { false };
            case (_) { true }
        }
    };

    public shared ({ caller }) func addMember(p : Principal, name : Text) : async Bool {
        assert (caller == masterPlatform);
        if (_isAMember(p)) {
            return false
        };
        let admissionDate = Time.now();
        let member = {
            name;
            admissionDate;
            enabled = true;
            votedTutoId : [TutoId] = [];
        };
        HashMap.put(members, principalEqual, principalHash, p, member);
        return true

    };

    public shared ({ caller }) func eneableMember(p : Principal) : async Bool {
        assert (caller == masterPlatform);
        return setMemberEnablement(p, true)
    };

    public shared ({ caller }) func disableMember(p : Principal) : async Bool {
        assert (caller == masterPlatform);
        return setMemberEnablement(p, false)
    };

    func setMemberEnablement(p : Principal, setMemberEnablement : Bool) : Bool {
        switch (HashMap.get(members, principalEqual, principalHash, p)) {
            case null {
                return false
            };
            case (?member) {
                let updateStatus = {
                    name = member.name;
                    admissionDate = member.admissionDate;
                    enabled = setMemberEnablement;
                    votedTutoId = member.votedTutoId;
                };
                HashMap.put(members, principalEqual, principalHash, p, updateStatus);
                return true
            }
        }
    };

 public shared ({ caller }) func votePublication(_member: Principal, _id : TutoId, _date : Int, _vote : Bool) : async Bool {
        assert (caller == masterPlatform);
        let member = HashMap.get(members, principalEqual, principalHash, _member);
        switch (member) {
            case null { return false };
            case (?member) {
                let currentDate = Time.now() / 1_000_000_000 : Int;

                for (id in member.votedTutoId.vals()) {
                    if (id == _id) { return false }
                };

                let status = switch (HashMap.get(postsInTheVotingProcess, tutoIdEqual, tutoIdHash, _id)) {
                    case null {
                        {
                            startRound = _date;
                            votes = 1;
                            balance = if (_vote) { 1 } else { -1 };
                            end = false;
                        }
                    };
                    case (?oldStatus) {
                        if (_date != oldStatus.startRound) {
                            return false
                        };
                        let vote = if (_vote) { 1 : Int } else { -1 : Int };
                        {
                            startRound = _date;
                            votes = oldStatus.votes + 1;
                            balance = oldStatus.balance + vote;
                            end = false;
                        }
                    }
                };
                HashMap.put(postsInTheVotingProcess, tutoIdEqual, tutoIdHash, _id, status);
                await tryPublicate(_id, currentDate);
                return true
            }
        }
    };

    func tryPublicate(_id : TutoId, _currentDate : Int): async () {
        switch (HashMap.get(postsInTheVotingProcess, tutoIdEqual, tutoIdHash, _id)) {
            case null {};
            case (?pub){
                if(pub.end) {return};
                if (pub.startRound + votingPeriod > _currentDate) {
                    let masterActor = actor (Principal.toText(masterPlatform)) : actor {
                            aprovePublication : shared (TutoId) -> async Result.Result<(), Text>;
                            rejectPublication: shared (Nat) -> async Result.Result<(), Text>;
                        };
                    if (pub.balance >= 0) {
                        ignore await masterActor.aprovePublication(_id);
                    } 
                    else {
                        ignore masterActor.rejectPublication(_id);
                    };

                    let status = {
                        startRound = pub.startRound;
                        votes = pub.votes;
                        balance = pub.balance;
                        end = true;
                    };
                    HashMap.put(postsInTheVotingProcess, tutoIdEqual, tutoIdHash, _id, status);
                };
            };
        };
    };
}
