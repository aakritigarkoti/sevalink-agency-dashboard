import LayoutWrapper from "@/components/layout/LayoutWrapper";

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

const availabilityStyles: Record<AvailabilityStatus, string> = {
  Available: "bg-green-100 text-green-800 ring-green-200",
  Busy: "bg-red-100 text-red-700 ring-red-200",
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
            <h1 className="text-2xl font-bold text-gray-900">Providers</h1>
            <p className="mt-1 text-sm text-gray-600">Manage assigned professionals and availability.</p>
          </div>
          <div className="rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 ring-1 ring-gray-200">
            Total Providers: {providers.length}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {providers.map((provider) => (
            <article
              key={provider.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg sm:p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                    {getInitials(provider.name)}
                  </span>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{provider.name}</h2>
                    <p className="text-sm font-medium text-gray-600">{provider.role}</p>
                  </div>
                </div>

                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${availabilityStyles[provider.availability]}`}
                >
                  {provider.availability}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium text-gray-900">Specialization:</span>{" "}
                  {provider.specialization}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Experience:</span>{" "}
                  {provider.experience}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Rating:</span>{" "}
                  <span className="text-amber-500">★</span> {provider.rating}
                </p>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-900">Services Offered</p>
                <div className="flex flex-wrap gap-2">
                  {provider.services.map((service) => (
                    <span
                      key={service}
                      className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
              >
                View Details
              </button>
            </article>
          ))}
        </div>
      </section>
    </LayoutWrapper>
  );
}
