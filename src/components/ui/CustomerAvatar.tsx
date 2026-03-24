// components/account/CustomerAvatar.tsx

type Props = {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  size?: "sm" | "md";
};

export function CustomerAvatar({
  firstName,
  lastName,
  email,
  size = "md",
}: Props) {
  const initials =
    [firstName?.[0], lastName?.[0]].filter(Boolean).join("") ||
    email[0].toUpperCase();

  if (size === "sm") {
    return (
      <div className="w-7 h-7 rounded-full bg-ink text-white flex items-center justify-center flex-shrink-0">
        <span className="font-body text-xs tracking-tight">{initials}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 mb-12">
      <div className="w-12 h-12 rounded-full bg-ink text-white flex items-center justify-center flex-shrink-0">
        <span className="font-body text-sm tracking-tight">{initials}</span>
      </div>
      <div>
        <p className="font-body font-semibold tracking-tighter text-xl text-ink leading-tight">
          {firstName} {lastName}
        </p>
        <p className="font-body text-sm text-muted tracking-tight">{email}</p>
      </div>
    </div>
  );
}
