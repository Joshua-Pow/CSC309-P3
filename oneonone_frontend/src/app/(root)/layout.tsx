import CustomNavbar from "@/components/CustomNavbar";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <CustomNavbar />

      {children}
    </section>
  );
}
