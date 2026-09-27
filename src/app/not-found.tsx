import { NoInvitation } from "@/components/NoInvitation";

export default function NotFound() {
  return (
    <NoInvitation
      title="Invitation not found"
      message="We couldn't find that invitation. Please scan the QR code on your invitation again, or get in touch with us."
    />
  );
}
