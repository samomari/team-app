export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full">
      <div className="h-screen flex items-center justify-center">
        {children}
      </div>
    </section>
  );
}
