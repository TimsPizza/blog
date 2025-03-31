export interface SubscriberList {
  id: number;
  name: string;
}

export interface ExtraField {
  id: number;
  name: string;
  value: string;
  options?: string[];
  type: "text" | string;
  required: boolean;
}

export interface Subscriber {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  country?: string;
  region?: string;
  city?: string;
  lists: SubscriberList[];
  extra_fields: ExtraField[];
  gender?: "F" | "M";
  status: "confirmed" | string;
}

export interface CreateSubscriberInput {
  email: string;
  first_name?: string;
  last_name?: string;
  country?: string;
  region?: string;
  city?: string;
  lists?: Array<{
    id: number;
    value: number;
  }>;
  list_N?: number;
  extra_fields?: Array<{
    id: number;
    value: string;
  }>;
  gender?: "F" | "M";
  status?: "confirmed" | string;
}

export interface GetSubscribersParams {
  per_page?: number;
  page?: number;
}
