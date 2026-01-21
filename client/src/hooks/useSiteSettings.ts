import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/strapi";
import { SiteSettings, StrapiResponse } from "@/types/strapi";

export function useSiteSettings() {
    const { data: strapiResponse, isLoading, error } = useQuery<StrapiResponse<SiteSettings>>({
        queryKey: ["/site-setting"],
        queryFn: () => fetchAPI<StrapiResponse<SiteSettings>>("/site-setting"),
        retry: 1,
        // Set staleTime to keep settings cached longer
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const settings = strapiResponse?.data;

    return {
        settings,
        isLoading,
        error
    };
}
