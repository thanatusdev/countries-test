import { expect, test, describe, vi, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { MockedProvider, MockedResponse, wait } from "@apollo/client/testing";
import Page from "./page";
import Layout from "./layout";
import { GET_USER } from "@/operations/queries/getUser";
import { GET_COUNTRIES } from "@/operations/queries/getCountries";
import { InMemoryCache } from "@apollo/client";
import { GET_COUNTRY } from "@/operations/queries/getCountry";

const { useRouter, mockedRouterPush, useSearchParams } = vi.hoisted(() => {
  const mockedRouterPush = vi.fn();
  const mockedSearchParams = vi.fn();
  const mockedRouterReplace = vi.fn();
  return {
    useRouter: () => ({ push: mockedRouterPush, replace: mockedRouterReplace }),
    useSearchParams: () => ({
      get: mockedSearchParams,
    }),
    mockedRouterPush,
  };
});

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    useRouter,
    useSearchParams,
  };
});

describe("Rendering dashboard layout", () => {
  afterEach(() => {
    mockedRouterPush.mockClear();
  });

  test("check if the user will be redirected", async () => {
    const mocks: readonly MockedResponse<any, any>[] | undefined = [
      {
        request: {
          query: GET_USER,
        },
        result: {
          data: {
            user: {
              username: "",
              jobTitle: "",
            },
          },
        },
      },
      {
        request: {
          query: GET_COUNTRIES,
          variables: {},
        },
        result: {
          data: {
            countries: [],
          },
        },
      },
    ];

    const cache = new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            user: {
              read() {
                return {
                  username: "",
                  jobTitle: "",
                };
              },
            },
          },
        },
      },
    });

    await act(() =>
      render(
        <MockedProvider mocks={mocks} cache={cache}>
          <Layout>
            <Page />
          </Layout>
        </MockedProvider>
      )
    );

    expect(mockedRouterPush).toHaveBeenCalledWith("/");
  });

  test("check if the user will not be redirected", async () => {
    const mocks: readonly MockedResponse<any, any>[] | undefined = [
      {
        request: {
          query: GET_USER,
        },
        result: {
          data: {
            user: {
              username: "john",
              jobTitle: "Developer",
            },
          },
        },
      },
      {
        request: {
          query: GET_COUNTRIES,
          variables: {},
        },
        result: {
          data: {
            countries: [],
          },
        },
      },
    ];

    const cache = new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            user: {
              read() {
                return {
                  username: "john",
                  jobTitle: "Developer",
                };
              },
            },
          },
        },
      },
    });

    await act(() => {
      render(
        <MockedProvider mocks={mocks} cache={cache}>
          <Layout>
            <Page />
          </Layout>
        </MockedProvider>
      );
    });

    expect(mockedRouterPush).not.toHaveBeenCalled();
  });

  test("check if countries are rendered", async () => {
    const mocks: readonly MockedResponse<any, any>[] | undefined = [
      {
        request: {
          query: GET_USER,
        },
        result: {
          data: {
            user: {
              username: "john",
              jobTitle: "Developer",
            },
          },
        },
      },
      {
        request: {
          query: GET_COUNTRIES,
          variables: {},
        },
        result: {
          data: {
            countries: [
              {
                name: "Nigeria",
                code: "NG",
                capital: "Abuja",
                emoji: "🇳🇬",
                languages: [
                  {
                    code: "en",
                    name: "English",
                  },
                ],
              },
            ],
          },
        },
      },
    ];

    const cache = new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            user: {
              read() {
                return {
                  username: "john",
                  jobTitle: "Developer",
                };
              },
            },
          },
        },
      },
    });

    await act(() => {
      render(
        <MockedProvider mocks={mocks} cache={cache}>
          <Layout>
            <Page />
          </Layout>
        </MockedProvider>
      );
    });

    await wait(0);

    expect(screen.getByText("Nigeria")).toBeDefined();
  });

  // Check if country details are rendered when a country is clicked
  test("check if country details are rendered", async () => {
    const mocks: readonly MockedResponse<any, any>[] | undefined = [
      {
        request: {
          query: GET_USER,
        },
        result: {
          data: {
            user: {
              username: "john",
              jobTitle: "Developer",
            },
          },
        },
      },
      {
        request: {
          query: GET_COUNTRIES,
          variables: {},
        },
        result: {
          data: {
            countries: [
              {
                name: "Nigeria",
                code: "NG",
                capital: "Abuja",
                emoji: "🇳🇬",
                languages: [
                  {
                    code: "en",
                    name: "English",
                  },
                ],
              },
            ],
          },
        },
      },
      {
        request: {
          query: GET_COUNTRY,
          variables: {
            code: "NG",
          },
        },
        result: {
          data: {
            country: {
              name: "Nigeria",
              native: "Nigeria",
              capital: "Abuja",
              emoji: "🇳🇬",
              currency: "NGN",
              languages: [
                {
                  code: "en",
                  name: "English",
                },
              ],
            },
          },
        },
      },
    ];

    const cache = new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            user: {
              read() {
                return {
                  username: "john",
                  jobTitle: "Developer",
                };
              },
            },
          },
        },
      },
    });

    await act(() => {
      render(
        <MockedProvider mocks={mocks} cache={cache}>
          <Layout>
            <Page />
          </Layout>
        </MockedProvider>
      );
    });

    await wait(0);

    expect(screen.getByText("Nigeria")).toBeDefined();

    // Click on the country
    await act(() => {
      screen.getByText("Nigeria").click();
      useSearchParams().get.mockReturnValue("NG");
    });

    // Set URL search params

    await wait(0);

    expect(screen.getByText("Capital: Abuja")).toBeDefined();
  });
});
