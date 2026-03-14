import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ContactMessage,
  Donation,
  EmergencyRequest,
  GalleryItem,
  TeamMember,
  Volunteer,
} from "../backend";
import { useActor } from "./useActor";

export function useTeamMembers() {
  const { actor, isFetching } = useActor();
  return useQuery<TeamMember[]>({
    queryKey: ["teamMembers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTeamMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGallery() {
  const { actor, isFetching } = useActor();
  return useQuery<GalleryItem[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGallery();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDonors() {
  const { actor, isFetching } = useActor();
  return useQuery<Donation[]>({
    queryKey: ["donors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDonors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSiteSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<[string, string][]>({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSiteSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVolunteers() {
  const { actor, isFetching } = useActor();
  return useQuery<Volunteer[]>({
    queryKey: ["volunteers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVolunteers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useEmergencyRequests() {
  const { actor, isFetching } = useActor();
  return useQuery<EmergencyRequest[]>({
    queryKey: ["emergencyRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEmergencyRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllDonations() {
  const { actor, isFetching } = useActor();
  return useQuery<Donation[]>({
    queryKey: ["allDonations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDonations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useContactMessages() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactMessage[]>({
    queryKey: ["contactMessages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContactMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitDonation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      donorName: string;
      amount: bigint | null;
      message: string | null;
      isAnonymous: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitDonation(
        data.donorName,
        data.amount,
        data.message,
        data.isAnonymous,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["donors"] });
    },
  });
}

export function useSubmitVolunteer() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      email: string;
      address: string;
      idProofBlobId: string;
      eduProofBlobId: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitVolunteer(
        data.name,
        data.phone,
        data.email,
        data.address,
        data.idProofBlobId,
        data.eduProofBlobId,
      );
    },
  });
}

export function useSubmitEmergency() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      location: string;
      problem: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitEmergency(
        data.name,
        data.phone,
        data.location,
        data.problem,
      );
    },
  });
}

export function useSubmitContact() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitContact(
        data.name,
        data.email,
        data.phone,
        data.message,
      );
    },
  });
}

export function useUpdateVolunteerStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateVolunteerStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["volunteers"] });
    },
  });
}

export function useMarkEmergencyRead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.markEmergencyRead(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emergencyRequests"] });
    },
  });
}

export function useMarkContactRead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.markContactRead(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contactMessages"] });
    },
  });
}

export function useAddGalleryItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      blobId: string;
      caption: string | null;
      order: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addGalleryItem(data.blobId, data.caption, data.order);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
}

export function useDeleteGalleryItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteGalleryItem(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
}

export function useAddTeamMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      role: string;
      photoBlobId: string | null;
      order: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addTeamMember(
        data.name,
        data.role,
        data.photoBlobId,
        data.order,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teamMembers"] });
    },
  });
}

export function useUpdateTeamMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      role: string;
      photoBlobId: string | null;
      order: bigint;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTeamMember(
        data.id,
        data.name,
        data.role,
        data.photoBlobId,
        data.order,
        data.isActive,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teamMembers"] });
    },
  });
}

export function useDeleteTeamMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteTeamMember(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teamMembers"] });
    },
  });
}

export function useUpdateSetting() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSetting(key, value);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["siteSettings"] });
    },
  });
}
