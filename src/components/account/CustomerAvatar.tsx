// src/components/account/CustomerAvatar.tsx
type Props = {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
};

export function CustomerAvatar({ firstName, lastName, email }: Props) {
  const initials =
    [firstName?.[0], lastName?.[0]].filter(Boolean).join("") ||
    email[0].toUpperCase();

  return (
    <div className="flex items-center gap-2 pb-6">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-ink text-white flex items-center justify-center flex-shrink-0">
        <span className="text-light text-2xl md:text-3xl tracking-normal uppercase">
          {initials}
        </span>
      </div>
      <div>
        <p className="font-medium tracking-[-0.04em] md:tracking-[-0.055em] text-3xl md:text-4xl lg:text-5xl text-ink leading-tight">
          {firstName} {lastName}
        </p>
        <p className="text-sm sm:text-base text-light tracking-tight">
          {email}
        </p>
      </div>
    </div>
  );
}
