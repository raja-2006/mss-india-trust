import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  Heart,
  Loader2,
  LogIn,
  Plus,
  ShieldX,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { getBlobUrl, useFileUpload } from "../hooks/useFileUpload";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddGalleryItem,
  useAddTeamMember,
  useAllDonations,
  useContactMessages,
  useDeleteGalleryItem,
  useDeleteTeamMember,
  useEmergencyRequests,
  useGallery,
  useIsCallerAdmin,
  useMarkContactRead,
  useMarkEmergencyRead,
  useSiteSettings,
  useTeamMembers,
  useUpdateSetting,
  useUpdateVolunteerStatus,
  useVolunteers,
} from "../hooks/useQueries";

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${variants[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}

// Dashboard Tab
function DashboardTab() {
  const { data: volunteers } = useVolunteers();
  const { data: emergencies } = useEmergencyRequests();
  const { data: contacts } = useContactMessages();

  const pendingVols =
    volunteers?.filter((v) => v.status === "pending").length ?? 0;
  const unreadEmergencies = emergencies?.filter((e) => !e.isRead).length ?? 0;
  const unreadContacts = contacts?.filter((c) => !c.isRead).length ?? 0;

  const cards = [
    {
      label: "Pending Volunteers",
      value: pendingVols,
      color: "bg-amber-50 border-amber-200 text-amber-700",
    },
    {
      label: "Unread Emergencies",
      value: unreadEmergencies,
      color: "bg-red-50 border-red-200 text-red-700",
    },
    {
      label: "Unread Messages",
      value: unreadContacts,
      color: "bg-blue-50 border-blue-200 text-blue-700",
    },
  ];

  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-foreground mb-6">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-2xl border p-6 ${c.color}`}>
            <p className="text-3xl font-heading font-bold mb-1">{c.value}</p>
            <p className="text-sm font-medium">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Volunteers Tab
function VolunteersTab() {
  const { data: volunteers, isLoading } = useVolunteers();
  const updateStatus = useUpdateVolunteerStatus();

  if (isLoading)
    return (
      <div className="text-center py-10">
        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
      </div>
    );

  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-foreground mb-6">
        Volunteers ({volunteers?.length ?? 0})
      </h2>
      {!volunteers || volunteers.length === 0 ? (
        <p
          className="text-muted-foreground text-center py-10"
          data-ocid="admin.volunteers.empty_state"
        >
          No volunteers yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((v, i) => (
                <TableRow
                  key={v.id}
                  data-ocid={`admin.volunteers.row.${i + 1}`}
                >
                  <TableCell className="text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell>{v.phone}</TableCell>
                  <TableCell>{v.email}</TableCell>
                  <TableCell>
                    <StatusBadge status={v.status} />
                  </TableCell>
                  <TableCell>{formatDate(v.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {v.status !== "approved" && (
                        <button
                          type="button"
                          onClick={() =>
                            updateStatus.mutate({
                              id: v.id,
                              status: "approved",
                            })
                          }
                          className="p-1.5 rounded-md bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
                          title="Approve"
                          data-ocid={`admin.approve_button.${i + 1}`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {v.status !== "rejected" && (
                        <button
                          type="button"
                          onClick={() =>
                            updateStatus.mutate({
                              id: v.id,
                              status: "rejected",
                            })
                          }
                          className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          title="Reject"
                          data-ocid={`admin.reject_button.${i + 1}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// Emergency Tab
function EmergencyTab() {
  const { data: requests, isLoading } = useEmergencyRequests();
  const markRead = useMarkEmergencyRead();

  if (isLoading)
    return (
      <div className="text-center py-10">
        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
      </div>
    );

  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-foreground mb-6">
        Emergency Requests ({requests?.length ?? 0})
      </h2>
      {!requests || requests.length === 0 ? (
        <p
          className="text-muted-foreground text-center py-10"
          data-ocid="admin.emergency.empty_state"
        >
          No emergency requests.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Problem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r, i) => (
                <TableRow
                  key={r.id}
                  data-ocid={`admin.emergency.row.${i + 1}`}
                  className={!r.isRead ? "bg-red-50/50" : ""}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.phone}</TableCell>
                  <TableCell>{r.location}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate text-sm">{r.problem}</p>
                  </TableCell>
                  <TableCell>
                    {r.isRead ? (
                      <span className="text-xs text-muted-foreground">
                        Read
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-red-600">
                        Unread
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {!r.isRead && (
                      <button
                        type="button"
                        onClick={() => markRead.mutate(r.id)}
                        className="px-3 py-1 text-xs bg-primary text-white rounded-md hover:bg-primary/90"
                        data-ocid={`admin.emergency.mark_read.${i + 1}`}
                      >
                        Mark Read
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// Donations Tab
function DonationsTab() {
  const { data: donations, isLoading } = useAllDonations();

  if (isLoading)
    return (
      <div className="text-center py-10">
        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
      </div>
    );

  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-foreground mb-6">
        All Donations ({donations?.length ?? 0})
      </h2>
      {!donations || donations.length === 0 ? (
        <p
          className="text-muted-foreground text-center py-10"
          data-ocid="admin.donations.empty_state"
        >
          No donations yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Amount (₹)</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Anonymous</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((d, i) => (
                <TableRow key={d.id} data-ocid={`admin.donations.row.${i + 1}`}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-medium">{d.donorName}</TableCell>
                  <TableCell>
                    {d.amount ? Number(d.amount).toLocaleString() : "-"}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate text-sm">{d.message ?? "-"}</p>
                  </TableCell>
                  <TableCell>{d.isAnonymous ? "Yes" : "No"}</TableCell>
                  <TableCell>{formatDate(d.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// Gallery Tab
function GalleryTab() {
  const { data: items, isLoading } = useGallery();
  const addItem = useAddGalleryItem();
  const deleteItem = useDeleteGalleryItem();
  const { uploadFile, isUploading } = useFileUpload();
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [resolvedUrls, setResolvedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!items) return;
    Promise.all(
      items.map(async (item) => {
        const url = await getBlobUrl(item.blobId).catch(() => "");
        return [item.id, url] as [string, string];
      }),
    ).then((pairs) => setResolvedUrls(Object.fromEntries(pairs)));
  }, [items]);

  const handleUpload = async () => {
    if (!file) return;
    try {
      const blobId = await uploadFile(file);
      await addItem.mutateAsync({
        blobId,
        caption: caption || null,
        order: BigInt(items?.length ?? 0),
      });
      setFile(null);
      setCaption("");
      toast.success("Image added successfully");
    } catch {
      toast.error("Failed to upload image");
    }
  };

  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-foreground mb-6">
        Gallery
      </h2>

      {/* Upload */}
      <div className="bg-muted/50 rounded-xl p-5 mb-6 flex flex-wrap gap-4 items-end">
        <div className="space-y-1.5">
          <Label>Image File</Label>
          <label
            className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg px-4 py-2.5 hover:bg-muted transition-colors"
            data-ocid="admin.gallery.dropzone"
          >
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {file ? file.name : "Choose file"}
            </span>
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
        <div className="space-y-1.5">
          <Label>Caption (optional)</Label>
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption..."
            className="w-48"
          />
        </div>
        <Button
          onClick={handleUpload}
          disabled={!file || isUploading || addItem.isPending}
          className="bg-primary text-white"
          data-ocid="admin.gallery.upload_button"
        >
          {isUploading || addItem.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4 mr-1" />
              Add Photo
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-3">
          {["a", "b", "c"].map((k) => (
            <div
              key={k}
              className="aspect-square bg-muted rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items?.map((item, i) => (
            <div
              key={item.id}
              className="relative group rounded-xl overflow-hidden aspect-square bg-muted"
              data-ocid={`admin.gallery.item.${i + 1}`}
            >
              {resolvedUrls[item.id] && (
                <img
                  src={resolvedUrls[item.id]}
                  alt={item.caption ?? "Gallery"}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => deleteItem.mutate(item.id)}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                  data-ocid={`admin.gallery.delete_button.${i + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Team Tab
function TeamTab() {
  const { data: members, isLoading } = useTeamMembers();
  const addMember = useAddTeamMember();
  const deleteMember = useDeleteTeamMember();
  const { uploadFile, isUploading } = useFileUpload();
  const [form, setForm] = useState({ name: "", role: "" });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleAdd = async () => {
    if (!form.name || !form.role) return;
    let photoBlobId: string | null = null;
    if (photoFile) {
      try {
        photoBlobId = await uploadFile(photoFile);
      } catch {
        toast.error("Photo upload failed");
        return;
      }
    }
    try {
      await addMember.mutateAsync({
        name: form.name,
        role: form.role,
        photoBlobId,
        order: BigInt(members?.length ?? 0),
      });
      setForm({ name: "", role: "" });
      setPhotoFile(null);
      toast.success("Member added");
    } catch {
      toast.error("Failed to add member");
    }
  };

  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-foreground mb-6">
        Team Members
      </h2>

      <div className="bg-muted/50 rounded-xl p-5 mb-6 flex flex-wrap gap-4 items-end">
        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Dr. Name"
            className="w-44"
            data-ocid="admin.team.name.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Role</Label>
          <Input
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="Chairman"
            className="w-40"
            data-ocid="admin.team.role.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Photo (optional)</Label>
          <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg px-4 py-2.5 hover:bg-muted transition-colors">
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {photoFile ? photoFile.name : "Photo"}
            </span>
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
        <Button
          onClick={handleAdd}
          disabled={isUploading || addMember.isPending}
          className="bg-primary text-white"
          data-ocid="admin.team.add_button"
        >
          {isUploading || addMember.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4 mr-1" />
              Add Member
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-6">
          <Loader2 className="w-6 h-6 animate-spin mx-auto" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.map((m, i) => (
                <TableRow key={m.id} data-ocid={`admin.team.row.${i + 1}`}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.role}</TableCell>
                  <TableCell>{m.isActive ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => deleteMember.mutate(m.id)}
                      className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600"
                      data-ocid={`admin.team.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// Settings Tab
function SettingsTab() {
  const { data: settings } = useSiteSettings();
  const updateSetting = useUpdateSetting();
  const { uploadFile, isUploading } = useFileUpload();

  const [fields, setFields] = useState({
    contactAddress: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [qrFile, setQrFile] = useState<File | null>(null);

  useEffect(() => {
    const map = Object.fromEntries(settings ?? []);
    setFields({
      contactAddress:
        map.contactAddress ??
        "F-45 Street No-2, Chand Bagh, North East Delhi – 110094",
      contactEmail: map.contactEmail ?? "mssindiatrust@gmail.com",
      contactPhone: map.contactPhone ?? "8447598015",
    });
  }, [settings]);

  const handleSave = async () => {
    try {
      await Promise.all(
        Object.entries(fields).map(([key, value]) =>
          updateSetting.mutateAsync({ key, value }),
        ),
      );
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  const handleQrUpload = async () => {
    if (!qrFile) return;
    try {
      const blobId = await uploadFile(qrFile);
      await updateSetting.mutateAsync({ key: "qrCodeBlobId", value: blobId });
      setQrFile(null);
      toast.success("QR code updated");
    } catch {
      toast.error("Failed to update QR code");
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="font-heading font-bold text-xl text-foreground mb-6">
        Site Settings
      </h2>
      <div className="space-y-4 bg-card border border-border rounded-xl p-6">
        <div className="space-y-1.5">
          <Label>Contact Address</Label>
          <Input
            value={fields.contactAddress}
            onChange={(e) =>
              setFields({ ...fields, contactAddress: e.target.value })
            }
            data-ocid="admin.settings.address.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Contact Email</Label>
          <Input
            type="email"
            value={fields.contactEmail}
            onChange={(e) =>
              setFields({ ...fields, contactEmail: e.target.value })
            }
            data-ocid="admin.settings.email.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Contact Phone</Label>
          <Input
            value={fields.contactPhone}
            onChange={(e) =>
              setFields({ ...fields, contactPhone: e.target.value })
            }
            data-ocid="admin.settings.phone.input"
          />
        </div>
        <Button
          onClick={handleSave}
          disabled={updateSetting.isPending}
          className="bg-primary text-white w-full"
          data-ocid="admin.settings.save_button"
        >
          {updateSetting.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>

      <div className="mt-6 space-y-4 bg-card border border-border rounded-xl p-6">
        <h3 className="font-heading font-semibold text-foreground">
          Update QR Code
        </h3>
        <label
          className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg px-4 py-3 hover:bg-muted transition-colors"
          data-ocid="admin.settings.qr.dropzone"
        >
          <Upload className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {qrFile ? qrFile.name : "Choose QR image"}
          </span>
          <input
            type="file"
            className="sr-only"
            accept="image/*"
            onChange={(e) => setQrFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <Button
          onClick={handleQrUpload}
          disabled={!qrFile || isUploading}
          className="bg-secondary text-white w-full"
          data-ocid="admin.settings.qr.upload_button"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Upload className="w-4 h-4 mr-1" />
              Upload QR Code
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Contact Messages Tab
function ContactTab() {
  const { data: messages, isLoading } = useContactMessages();
  const markRead = useMarkContactRead();

  if (isLoading)
    return (
      <div className="text-center py-10">
        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
      </div>
    );

  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-foreground mb-6">
        Contact Messages ({messages?.length ?? 0})
      </h2>
      {!messages || messages.length === 0 ? (
        <p
          className="text-muted-foreground text-center py-10"
          data-ocid="admin.contact.empty_state"
        >
          No messages yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((m, i) => (
                <TableRow
                  key={m.id}
                  data-ocid={`admin.contact.row.${i + 1}`}
                  className={!m.isRead ? "bg-blue-50/40" : ""}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{m.phone}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate text-sm">{m.message}</p>
                  </TableCell>
                  <TableCell>
                    {m.isRead ? (
                      <span className="text-xs text-muted-foreground">
                        Read
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-blue-600">
                        Unread
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {!m.isRead && (
                      <button
                        type="button"
                        onClick={() => markRead.mutate(m.id)}
                        className="px-3 py-1 text-xs bg-primary text-white rounded-md hover:bg-primary/90"
                        data-ocid={`admin.contact.mark_read.${i + 1}`}
                      >
                        Mark Read
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();
  const isLoggedIn = !!identity;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
            MSS India Trust
          </h1>
          <p className="text-muted-foreground mb-8">
            Admin Panel – Please login to continue
          </p>
          <Button
            size="lg"
            className="bg-primary text-white w-full"
            onClick={login}
            disabled={loginStatus === "logging-in"}
            data-ocid="admin.login.primary_button"
          >
            {loginStatus === "logging-in" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Login with Internet Identity
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <ShieldX className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground mb-6">
            You do not have admin access to this panel.
          </p>
          <a href="/" className="text-primary underline">
            ← Back to website
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-primary text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6" />
          <span className="font-heading font-bold">
            MSS India Trust – Admin
          </span>
        </div>
        <a
          href="/"
          className="text-white/70 hover:text-white text-sm transition-colors"
        >
          ← View Site
        </a>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard">
          <TabsList className="flex flex-wrap h-auto gap-1 mb-8 bg-muted p-1 rounded-xl w-full">
            {[
              ["dashboard", "Dashboard"],
              ["volunteers", "Volunteers"],
              ["emergency", "Emergency"],
              ["donations", "Donations"],
              ["gallery", "Gallery"],
              ["team", "Team"],
              ["settings", "Settings"],
              ["contact", "Messages"],
            ].map(([value, label]) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex-1 min-w-fit data-[state=active]:bg-white data-[state=active]:shadow-sm"
                data-ocid={`admin.${value}.tab`}
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab />
          </TabsContent>
          <TabsContent value="volunteers">
            <VolunteersTab />
          </TabsContent>
          <TabsContent value="emergency">
            <EmergencyTab />
          </TabsContent>
          <TabsContent value="donations">
            <DonationsTab />
          </TabsContent>
          <TabsContent value="gallery">
            <GalleryTab />
          </TabsContent>
          <TabsContent value="team">
            <TeamTab />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
          <TabsContent value="contact">
            <ContactTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
