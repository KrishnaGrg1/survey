import { submitSurvey } from "#/lib/services/public-survery.service";
import type { SubmitSurveyPayload } from "#/lib/types/public-suvery.type";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSubmitSurvey(slug: string) {
  return useMutation({
    mutationFn: (payload: SubmitSurveyPayload) =>
      submitSurvey(slug, payload),

    onSuccess: () => {
      toast.success('Survey submitted successfully')
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit survey')
    },
  })
}


