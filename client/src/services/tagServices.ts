import type { CreateTagPayload, Tag } from "@/types/tag";
import { axiosClient as axios } from "@/lib/axios";
import type { BaseResponse } from "@/types/global.types";

export const createTag = async (payload: CreateTagPayload): Promise<{data: BaseResponse<Tag>}> => {
  try {
    const res = await axios.post("/tags", payload);
    return res;
  } catch (error) {
    console.error("Error creating tag:", error);
    throw new Error("Failed to create tag");
  }
};

