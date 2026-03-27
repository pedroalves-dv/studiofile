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
        <span className="text-xs tracking-wide uppercase">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-ink text-white flex items-center justify-center flex-shrink-0">
        <span className="text-lg tracking-wide uppercase">
          {initials}
        </span>
      </div>
      <div>
        <p className="font-semibold tracking-tighter text-3xl text-ink leading-tight">
          {firstName} {lastName}
        </p>
        <p className="text-base text-light tracking-tight">{email}</p>
      </div>
    </div>
  );
}
