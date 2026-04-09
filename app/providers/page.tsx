import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type AvailabilityStatus = "Available" | "Busy";

type ProviderRole = "Nurse" | "Physiotherapist" | "Caregiver" | "Doctor";

type Provider = {
  id: number;
  name: string;
  role: ProviderRole;
  specialization: string;
  experience: string;
  rating: string;
  services: string[];
  availability: AvailabilityStatus;
};

const providers: Provider[] = [
  {
    id: 1,
    name: "Sonal Mehta",
    role: "Nurse",
    specialization: "Post-Surgery Care",
    experience: "6 years",
    rating: "4.8",
    services: ["Nursing Care", "Post-Surgery Care", "Mother & Baby"],
    availability: "Available",
  },
  {
    id: 2,
    name: "Ritesh Kulkarni",
    role: "Physiotherapist",
    specialization: "Chronic Pain Management",
    experience: "5 years",
    rating: "4.6",
    services: ["Physiotherapy", "Chronic Care"],
    availability: "Busy",
  },
  {
    id: 3,
    name: "Neha Trivedi",
    role: "Caregiver",
    specialization: "Elderly Support",
    experience: "7 years",
    rating: "4.7",
    services: ["Elderly Care", "Chronic Care", "Dementia Care"],
    availability: "Available",
  },
  {
    id: 4,
    name: "Dr. Karan Shah",
    role: "Doctor",
    specialization: "General Home Visit",
    experience: "8 years",
    rating: "4.9",
    services: ["Doctor Visit", "Chronic Care", "Lab Tests"],
    availability: "Busy",
  },
  {
    id: 5,
    name: "Aditi Rao",
    role: "Nurse",
    specialization: "Mother & Baby Care",
    experience: "4 years",
    rating: "4.5",
    services: ["Nursing Care", "Mother & Baby"],
    availability: "Available",
  },
  {
    id: 6,
    name: "Manish Parmar",
    role: "Physiotherapist",
    specialization: "Post-Fracture Recovery",
    experience: "3 years",
    rating: "4.3",
    services: ["Physiotherapy", "Post-Surgery Care"],
    availability: "Available",
  },
  {
    id: 7,
    name: "Farah Naqvi",
    role: "Caregiver",
    specialization: "Long-Term Elderly Care",
    experience: "6 years",
    rating: "4.4",
    services: ["Elderly Care", "Chronic Care"],
    availability: "Busy",
  },
  {
    id: 8,
    name: "Dr. Pooja Nair",
    role: "Doctor",
    specialization: "Internal Medicine",
    experience: "7 years",
    rating: "4.8",
    services: ["Doctor Visit", "Chronic Care", "Lab Tests"],
    availability: "Available",
  },
  {
    id: 9,
    name: "Yashvi Desai",
    role: "Nurse",
    specialization: "Chronic Care Support",
    experience: "5 years",
    rating: "4.7",
    services: ["Nursing Care", "Chronic Care", "Post-Surgery Care"],
    availability: "Available",
  },
];

const availabilityVariants: Record<AvailabilityStatus, "default" | "secondary"> = {
  Available: "default",
  Busy: "secondary",
};

function getInitials(name: string) {
  return name
    .replace("Dr. ", "")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function ProvidersPage() {
  return (
    <LayoutWrapper>
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Providers</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage assigned professionals and availability.</p>
          </div>
          <Badge variant="outline" className="h-auto px-3 py-1 text-sm font-medium">
            Total Providers: {providers.length}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {providers.map((provider) => (
            <Card
              key={provider.id}
              className="p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                    {getInitials(provider.name)}
                  </span>

                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-card-foreground">{provider.name}</h2>
                    <p className="text-xs font-medium text-muted-foreground">{provider.role}</p>
                  </div>
                </div>

                <Badge variant={availabilityVariants[provider.availability]}>
                  {provider.availability}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="block text-[11px] font-medium text-muted-foreground/90">Experience</span>
                  <span className="text-sm font-medium text-foreground">{provider.experience}</span>
                </p>
                <p>
                  <span className="block text-[11px] font-medium text-muted-foreground/90">Rating</span>
                  <span className="text-sm font-medium text-foreground">
                    <span className="text-primary">★</span> {provider.rating}
                  </span>
                </p>
                <p className="col-span-2">
                  <span className="block text-[11px] font-medium text-muted-foreground/90">Specialization</span>
                  <span className="text-sm text-foreground">{provider.specialization}</span>
                </p>
              </div>

              <div className="mt-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Services</p>
                <div className="flex flex-wrap gap-1.5">
                  {provider.services.map((service) => (
                    <Badge
                      key={service}
                      variant="outline"
                      className="text-[11px]"
                    >
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button className="mt-4 w-full">
                View Details
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </LayoutWrapper>
  );
}
