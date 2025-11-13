import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { Prisma, PrismaErrorCode } from "../../database.ts";
import { createUser } from "../../repos/user.ts";
import { sendAPIError } from "../errors.ts";

export const api = new OpenAPIHono();

const UserSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  public_id: z.string().openapi({ example: "abc123" }),
  name: z.string().openapi({ example: "Alice Smith" }),
  username: z.string().openapi({ example: "alice" }),
  summary: z.string().openapi({ example: "Software developer" }),
});

const CreateUserSchema = z.object({
  public_id: z.string().openapi({ example: "abc123" }),
  name: z.string().openapi({ example: "Alice Smith" }),
  username: z.string().openapi({ example: "alice" }),
  summary: z.string().openapi({ example: "Software developer" }),
});

const createUserRoute = createRoute({
  method: "post",
  path: "/users",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateUserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
      description: "User created successfully",
    },
    400: {
      description: "Invalid request body",
    },
    409: {
      description: "User with public ID already exists",
    },
  },
  tags: ["Users"],
  summary: "Create a new user",
  description: "Creates a new user account",
});

api.openapi(createUserRoute, async (c) => {
  const data = c.req.valid("json");

  try {
    const user = await createUser(data);
    return c.json(user, 201);
  } catch (error) {
    // Handle Prisma unique constraint violation
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION
    ) {
      const field = error.meta?.target?.[0] || "field";
      if (field === "public_id") {
        return sendAPIError(c, 409, {
          detail: `A user with the public ID '${data.public_id}' already exists`,
          target: ["public_id"],
        });
      }
    }

    // Re-throw other errors
    throw error;
  }
});
