import Map "mo:core/Map";
import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Timer "mo:core/Timer";
import List "mo:core/List";
import Nat8 "mo:core/Nat8";
import Char "mo:core/Char";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Mixins
  include MixinStorage();

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
  };

  // Data Types
  type Volunteer = {
    id : Text;
    name : Text;
    phone : Text;
    email : Text;
    address : Text;
    idProofBlobId : Text;
    eduProofBlobId : ?Text;
    status : Text; // "pending", "approved", "rejected"
    createdAt : Int;
  };

  type EmergencyRequest = {
    id : Text;
    name : Text;
    phone : Text;
    location : Text;
    problem : Text;
    createdAt : Int;
    isRead : Bool;
  };

  type Donation = {
    id : Text;
    donorName : Text; // "Anonymous" if isAnonymous is true
    amount : ?Nat;
    message : ?Text;
    isAnonymous : Bool;
    createdAt : Int;
  };

  type TeamMember = {
    id : Text;
    name : Text;
    role : Text;
    photoBlobId : ?Text;
    order : Nat;
    isActive : Bool;
  };

  type GalleryItem = {
    id : Text;
    blobId : Text;
    caption : ?Text;
    order : Nat;
  };

  type ContactMessage = {
    id : Text;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    createdAt : Int;
    isRead : Bool;
  };

  // State
  let userProfiles = Map.empty<Principal, UserProfile>();
  let volunteers = Map.empty<Text, Volunteer>();
  let emergencies = Map.empty<Text, EmergencyRequest>();
  let donations = Map.empty<Text, Donation>();
  let teamMembers = Map.empty<Text, TeamMember>();
  let galleryItems = Map.empty<Text, GalleryItem>();
  let settings = Map.empty<Text, Text>();
  let contacts = Map.empty<Text, ContactMessage>();

  var idCounter : Nat = 0;

  func generateId() : Text {
    idCounter += 1;
    Nat.toText(idCounter);
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // PUBLIC FUNCTIONS (No authentication required)

  public shared ({ caller }) func submitVolunteer(
    name : Text,
    phone : Text,
    email : Text,
    address : Text,
    idProofBlobId : Text,
    eduProofBlobId : ?Text
  ) : async Text {
    let id = generateId();

    let volunteer : Volunteer = {
      id;
      name;
      phone;
      email;
      address;
      idProofBlobId;
      eduProofBlobId;
      status = "pending";
      createdAt = 0;
    };

    volunteers.add(id, volunteer);
    id;
  };

  public shared ({ caller }) func submitEmergency(
    name : Text,
    phone : Text,
    location : Text,
    problem : Text
  ) : async Text {
    let id = generateId();

    let emergency : EmergencyRequest = {
      id;
      name;
      phone;
      location;
      problem;
      createdAt = 0;
      isRead = false;
    };

    emergencies.add(id, emergency);
    id;
  };

  public shared ({ caller }) func submitDonation(
    donorName : Text,
    amount : ?Nat,
    message : ?Text,
    isAnonymous : Bool
  ) : async Text {
    let id = generateId();

    let displayName = if (isAnonymous) { "Anonymous" } else { donorName };

    let donation : Donation = {
      id;
      donorName = displayName;
      amount;
      message;
      isAnonymous;
      createdAt = 0;
    };

    donations.add(id, donation);
    id;
  };

  public shared ({ caller }) func submitContact(
    name : Text,
    email : Text,
    phone : Text,
    message : Text
  ) : async Text {
    let id = generateId();

    let contact : ContactMessage = {
      id;
      name;
      email;
      phone;
      message;
      createdAt = 0;
      isRead = false;
    };

    contacts.add(id, contact);
    id;
  };

  public query ({ caller }) func getTeamMembers() : async [TeamMember] {
    let activeMembers = teamMembers.values().toArray().filter(
      func(member) { member.isActive }
    );
    activeMembers.sort<TeamMember>(func(a, b) { Nat.compare(a.order, b.order) });
  };

  public query ({ caller }) func getGallery() : async [GalleryItem] {
    let items = galleryItems.values().toArray();
    items.sort<GalleryItem>(func(a, b) { Nat.compare(a.order, b.order) });
  };

  public query ({ caller }) func getSiteSettings() : async [(Text, Text)] {
    settings.toArray();
  };

  public query ({ caller }) func getDonors() : async [Donation] {
    // Only return non-anonymous donations
    donations.values().toArray().filter<Donation>(
      func(donation) { not donation.isAnonymous }
    );
  };

  // ADMIN-ONLY FUNCTIONS

  public query ({ caller }) func getVolunteers() : async [Volunteer] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view volunteers");
    };
    volunteers.values().toArray();
  };

  public shared ({ caller }) func updateVolunteerStatus(id : Text, status : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update volunteer status");
    };

    switch (volunteers.get(id)) {
      case (null) { Runtime.trap("Volunteer not found") };
      case (?volunteer) {
        let updated : Volunteer = {
          id = volunteer.id;
          name = volunteer.name;
          phone = volunteer.phone;
          email = volunteer.email;
          address = volunteer.address;
          idProofBlobId = volunteer.idProofBlobId;
          eduProofBlobId = volunteer.eduProofBlobId;
          status;
          createdAt = volunteer.createdAt;
        };
        volunteers.add(id, updated);
      };
    };
  };

  public query ({ caller }) func getEmergencyRequests() : async [EmergencyRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view emergency requests");
    };
    emergencies.values().toArray();
  };

  public shared ({ caller }) func markEmergencyRead(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can mark emergency requests as read");
    };

    switch (emergencies.get(id)) {
      case (null) { Runtime.trap("Emergency request not found") };
      case (?emergency) {
        let updated : EmergencyRequest = {
          id = emergency.id;
          name = emergency.name;
          phone = emergency.phone;
          location = emergency.location;
          problem = emergency.problem;
          createdAt = emergency.createdAt;
          isRead = true;
        };
        emergencies.add(id, updated);
      };
    };
  };

  public query ({ caller }) func getAllDonations() : async [Donation] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all donations");
    };
    donations.values().toArray();
  };

  public shared ({ caller }) func addTeamMember(
    name : Text,
    role : Text,
    photoBlobId : ?Text,
    order : Nat
  ) : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add team members");
    };

    let id = generateId();

    let member : TeamMember = {
      id;
      name;
      role;
      photoBlobId;
      order;
      isActive = true;
    };

    teamMembers.add(id, member);
    id;
  };

  public shared ({ caller }) func updateTeamMember(
    id : Text,
    name : Text,
    role : Text,
    photoBlobId : ?Text,
    order : Nat,
    isActive : Bool
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update team members");
    };

    switch (teamMembers.get(id)) {
      case (null) { Runtime.trap("Team member not found") };
      case (?_) {
        let updated : TeamMember = {
          id;
          name;
          role;
          photoBlobId;
          order;
          isActive;
        };
        teamMembers.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteTeamMember(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete team members");
    };

    switch (teamMembers.get(id)) {
      case (null) { Runtime.trap("Team member not found") };
      case (?_) {
        teamMembers.remove(id);
      };
    };
  };

  public shared ({ caller }) func addGalleryItem(
    blobId : Text,
    caption : ?Text,
    order : Nat
  ) : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add gallery items");
    };

    let id = generateId();

    let item : GalleryItem = {
      id;
      blobId;
      caption;
      order;
    };

    galleryItems.add(id, item);
    id;
  };

  public shared ({ caller }) func deleteGalleryItem(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete gallery items");
    };

    switch (galleryItems.get(id)) {
      case (null) { Runtime.trap("Gallery item not found") };
      case (?_) {
        galleryItems.remove(id);
      };
    };
  };

  public shared ({ caller }) func updateSetting(key : Text, value : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update settings");
    };
    settings.add(key, value);
  };

  public query ({ caller }) func getContactMessages() : async [ContactMessage] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view contact messages");
    };
    contacts.values().toArray();
  };

  public shared ({ caller }) func markContactRead(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can mark contact messages as read");
    };

    switch (contacts.get(id)) {
      case (null) { Runtime.trap("Contact message not found") };
      case (?contact) {
        let updated : ContactMessage = {
          id = contact.id;
          name = contact.name;
          email = contact.email;
          phone = contact.phone;
          message = contact.message;
          createdAt = contact.createdAt;
          isRead = true;
        };
        contacts.add(id, updated);
      };
    };
  };
};
