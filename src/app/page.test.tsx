import { expect, test, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MockedProvider, MockedResponse, wait } from "@apollo/client/testing";
import Page from "./page";
import { describe } from "node:test";
import { InMemoryCache } from "@apollo/client";
import { GET_USER } from "@/operations/queries/getUser";

const mocks: readonly MockedResponse<any, any>[] | undefined = []; // We'll fill this in next

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

describe("Rendering welcome page", () => {
  test("check if page has continue button", async () => {
    await act(() =>
      render(
        <MockedProvider mocks={mocks}>
          <Page />
        </MockedProvider>
      )
    );
    expect(screen.getByRole("button", { name: /continue/i })).toBeDefined();
  });
  // Add User Info after clicking on the continue button
  test("check if user info is displayed after clicking on the continue button", async () => {
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
          <Page />
        </MockedProvider>
      )
    );

    await act(() => {
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    });

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeDefined();
    });

    // Check if username input is displayed
    expect(screen.getByLabelText(/username/i)).toBeDefined();
    // Type in username
    await act(() => {
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: "john" },
      });
    });

    // Use Enter key to submit form
    await act(() => {
      fireEvent.keyDown(screen.getByLabelText(/username/i), {
        key: "Enter",
        code: 13,
      });
    });

    // Check if job title input is displayed
    expect(screen.getByLabelText(/job title/i)).toBeDefined();

    // Type in job title
    await act(() => {
      fireEvent.change(screen.getByLabelText(/job title/i), {
        target: { value: "Developer" },
      });
    });

    // Use Enter key to submit form
    await act(() => {
      fireEvent.keyDown(screen.getByLabelText(/job title/i), {
        key: "Enter",
        code: 13,
      });
    });

    // Check if router push is called
    expect(mockedRouterPush).toHaveBeenCalledWith("/dashboard");
  });
});
