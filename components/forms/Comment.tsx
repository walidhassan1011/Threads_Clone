"use client";
import React from "react";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
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

import { Input } from "../ui/input";

// import { updateUser } from "@/lib/actions/user.action";
import { useRouter, usePathname } from "next/navigation";
import { commentSchema } from "@/lib/validations/thread";
import { addCommentToThread } from "@/lib/actions/thread.action";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}
const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      thread: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof commentSchema>) => {
    await addCommentToThread(
      threadId,
      values.thread,
      JSON.parse(currentUserId),
      pathname
    );
    form.reset();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="
    comment-form
    "
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem
              className="flex   
             items-center
            gap-3
          w-full"
            >
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="profile"
                  className="rounded-full 
                    object-cover
                  "
                  width={48}
                  height={48}
                />
              </FormLabel>
              <FormControl
                className="border-none
                bg-transparent

            "
              >
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus
                        text-light-1
                        outline-none
                    "
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="
            comment-form_btn
        "
        >
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
