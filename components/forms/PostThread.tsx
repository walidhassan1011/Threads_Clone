"use client";
import React from "react";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import * as z from "zod";

import { Textarea } from "../ui/textarea";

import { updateUser } from "@/lib/actions/user.action";
import { useRouter, usePathname } from "next/navigation";
import { threadSchema } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.action";
interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const PostThread = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(threadSchema),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });
  const onSubmit = async (values: z.infer<typeof threadSchema>) => {
    await createThread({
      text: values.thread,
      author: userId,
      communityId: null,
      path: pathname,
    });
    router.push("/");
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="
      flex flex-col
      justify-start
      gap-10
      mt-10
      "
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem
              className="flex   
                flex-col
              gap-3
            w-full"
            >
              <FormLabel
                className="
                text-base-semibold
                text-light-2
               
              "
              >
                Content
              </FormLabel>
              <FormControl
                className="no-focus
                border border-dark-4
                bg-dark-3
                text-light-1
              "
              >
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Post Thread
        </Button>
      </form>
    </Form>
  );
};

export default PostThread;
