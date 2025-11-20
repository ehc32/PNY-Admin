import ActionButtons from "@/components/action-buttons";
import Hero from "@/components/hero";
import MaintenanceForm from "@/components/maintenance-form";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ActionButtons />
      <MaintenanceForm />
      <Footer />
    </main>
  )
}
