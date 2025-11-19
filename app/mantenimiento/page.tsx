import ActionButtons from "@/components/action-buttons";
import Hero from "@/components/hero";
import MaintenanceForm from "@/components/maintenance-form";
import AssetForm from "@/components/asset-form";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-white to-white">
      <Header />
      <Hero />
      <div className="relative z-10 -mt-12 space-y-10">
        <ActionButtons />
        <MaintenanceForm />
        <AssetForm />
      </div>
      <Footer />
    </main>
  )
}
