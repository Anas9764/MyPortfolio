import type { Metadata } from "next";
import { getPortfolioData } from "@/lib/services/portfolio";
import PortfolioClient from "@/components/portfolio/PortfolioClient";
import StyledComponentsRegistry from "@/lib/registry";
import type { PortfolioData } from "@/types/portfolio";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getPortfolioData();
    const bio = data.bio as PortfolioData["bio"];
    const title = bio?.name
      ? `${bio.name} - Portfolio`
      : "Anas Qureshi - Full Stack Developer Portfolio";
    const description =
      bio?.description ||
      "Anas Qureshi - Full Stack Developer Portfolio";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: bio?.image ? [{ url: bio.image }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: bio?.image ? [bio.image] : [],
      },
    };
  } catch {
    return {
      title: "Anas Qureshi - Full Stack Developer Portfolio",
      description: "Anas Qureshi - Full Stack Developer Portfolio",
    };
  }
}

export default async function HomePage() {
  try {
    const data = await getPortfolioData();

    return (
      <StyledComponentsRegistry>
        <PortfolioClient
          data={{
            bio: data.bio as PortfolioData["bio"],
            skills: data.skills as PortfolioData["skills"],
            experiences: data.experiences as PortfolioData["experiences"],
            education: data.education as PortfolioData["education"],
            projects: data.projects as PortfolioData["projects"],
          }}
        />
      </StyledComponentsRegistry>
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load portfolio data";

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#191924] text-white p-8">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="text-2xl font-semibold">Portfolio failed to load</h1>
          <p className="text-gray-400">{message}</p>
          <p className="text-sm text-gray-500">
            Check that <code className="text-purple-400">.env.local</code> has a
            valid <code className="text-purple-400">MONGO_URI</code> and MongoDB
            is reachable.
          </p>
        </div>
      </div>
    );
  }
}
