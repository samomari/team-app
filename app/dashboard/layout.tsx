export default function DashboardLayout ({ 
    children 
}: { 
    children: React.ReactNode 
}) {
    return (
        <section className="w-full">
            <div className="h-screen flex justify-center">
                {children}
            </div>
        </section>
    );
}