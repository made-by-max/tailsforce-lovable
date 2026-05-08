import { createFileRoute } from "@tanstack/react-router";
import { PetsTable } from "@/components/pets-table";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Current Pets — Pawfolio" },
      { name: "description", content: "View and manage adoptable pets currently in your rescue's care." },
    ],
  }),
  component: CurrentPetsPage,
});

function CurrentPetsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Adoption</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current Pets</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Current Pets</h1>
          <p className="text-sm text-muted-foreground">
            All adoptable pets currently in foster, transit, or recently placed.
          </p>
        </div>
      </div>
      <PetsTable />
    </div>
  );
}
