import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Donation {
    id: string;
    createdAt: bigint;
    donorName: string;
    isAnonymous: boolean;
    message?: string;
    amount?: bigint;
}
export interface ContactMessage {
    id: string;
    name: string;
    createdAt: bigint;
    isRead: boolean;
    email: string;
    message: string;
    phone: string;
}
export interface EmergencyRequest {
    id: string;
    name: string;
    createdAt: bigint;
    isRead: boolean;
    phone: string;
    location: string;
    problem: string;
}
export interface TeamMember {
    id: string;
    order: bigint;
    name: string;
    role: string;
    isActive: boolean;
    photoBlobId?: string;
}
export interface Volunteer {
    id: string;
    status: string;
    name: string;
    createdAt: bigint;
    email: string;
    address: string;
    eduProofBlobId?: string;
    phone: string;
    idProofBlobId: string;
}
export interface GalleryItem {
    id: string;
    order: bigint;
    caption?: string;
    blobId: string;
}
export interface UserProfile {
    name: string;
    email?: string;
    phone?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGalleryItem(blobId: string, caption: string | null, order: bigint): Promise<string>;
    addTeamMember(name: string, role: string, photoBlobId: string | null, order: bigint): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteGalleryItem(id: string): Promise<void>;
    deleteTeamMember(id: string): Promise<void>;
    getAllDonations(): Promise<Array<Donation>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactMessages(): Promise<Array<ContactMessage>>;
    getDonors(): Promise<Array<Donation>>;
    getEmergencyRequests(): Promise<Array<EmergencyRequest>>;
    getGallery(): Promise<Array<GalleryItem>>;
    getSiteSettings(): Promise<Array<[string, string]>>;
    getTeamMembers(): Promise<Array<TeamMember>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVolunteers(): Promise<Array<Volunteer>>;
    isCallerAdmin(): Promise<boolean>;
    markContactRead(id: string): Promise<void>;
    markEmergencyRead(id: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContact(name: string, email: string, phone: string, message: string): Promise<string>;
    submitDonation(donorName: string, amount: bigint | null, message: string | null, isAnonymous: boolean): Promise<string>;
    submitEmergency(name: string, phone: string, location: string, problem: string): Promise<string>;
    submitVolunteer(name: string, phone: string, email: string, address: string, idProofBlobId: string, eduProofBlobId: string | null): Promise<string>;
    updateSetting(key: string, value: string): Promise<void>;
    updateTeamMember(id: string, name: string, role: string, photoBlobId: string | null, order: bigint, isActive: boolean): Promise<void>;
    updateVolunteerStatus(id: string, status: string): Promise<void>;
}
