import {
  CreateSubscriberInput,
  GetSubscribersParams,
  Subscriber,
} from "./types/subscriber";

const NEWSLETTER_API_URL = process.env.NEWSLETTER_API_URL;
const NEWSLETTER_CLIENT_KEY = process.env.NEWSLETTER_CLIENT_KEY;
const NEWSLETTER_CLIENT_SECRET = process.env.NEWSLETTER_CLIENT_SECRET;

if (
  !NEWSLETTER_API_URL ||
  !NEWSLETTER_CLIENT_KEY ||
  !NEWSLETTER_CLIENT_SECRET
) {
  throw new Error("Newsletter API configuration missing");
}

/**
 * 获取认证参数
 * Get authentication parameters
 */
function getAuthParams(): URLSearchParams {
  return new URLSearchParams({
    client_key: NEWSLETTER_CLIENT_KEY!,
    client_secret: NEWSLETTER_CLIENT_SECRET!,
  });
}

/**
 * Build API URL with authentication
 */
function buildApiUrl(
  endpoint: string,
  params?: Record<string, string>,
): string {
  const searchParams = getAuthParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
  }
  return `${NEWSLETTER_API_URL}${endpoint}?${searchParams.toString()}`;
}

/**
 * Get subscribers list from the Newsletter API
 */
export async function getSubscribers(
  params?: GetSubscribersParams,
): Promise<Subscriber[]> {
  try {
    const queryParams: Record<string, string> = {};
    if (params?.per_page) {
      queryParams.per_page = params.per_page.toString();
    }
    if (params?.page) {
      queryParams.page = params.page.toString();
    }

    const response = await fetch(buildApiUrl("/subscribers", queryParams), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Newsletter API error: ${response.statusText}`);
    }

    const subscribers = await response.json();
    return subscribers;
  } catch (error) {
    console.error("[NEWSLETTER_API_ERROR]", error);
    throw error;
  }
}

/**
 * Create a new subscriber in the Newsletter API
 */
export async function createSubscriber(
  input: CreateSubscriberInput,
): Promise<Subscriber> {
  try {
    const response = await fetch(buildApiUrl("/subscribers"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(error.message || "Failed to create subscriber");
    }

    const subscriber = await response.json();
    return subscriber;
  } catch (error) {
    console.error("[NEWSLETTER_API_ERROR]", error);
    throw error;
  }
}

/**
 * 更新订阅者状态
 * Update subscriber in the Newsletter API
 */
export async function updateSubscriber(
  subscriberId: number,
  input: Partial<CreateSubscriberInput>,
): Promise<Subscriber> {
  try {
    const response = await fetch(buildApiUrl(`/subscribers/${subscriberId}`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(error.message || "Failed to update subscriber");
    }

    const subscriber = await response.json();
    return subscriber;
  } catch (error) {
    console.error("[NEWSLETTER_API_ERROR]", error);
    throw error;
  }
}
