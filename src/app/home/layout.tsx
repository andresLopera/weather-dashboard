import SideBarComponent from "@/components/nav/sidebar";


function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <SideBarComponent />
      <section className="flex-1">
        {children}
      </section>
    </div>
  );
}

export default HomeLayout