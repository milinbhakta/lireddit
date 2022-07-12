import React from "react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import toast from 'react-hot-toast';

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const { data: meData } = useMeQuery();
  const [deletePost] = useDeletePostMutation();

  const deletePostToast = () => toast.success('Post deleted successfully!');

  if (meData?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton>
          <EditIcon />
        </IconButton>
      </NextLink>
      <IconButton
        onClick={() => {
          deletePost({
            variables: { id },
            update: (cache) => {
              // Post:77
              cache.evict({ id: "Post:" + id });
              deletePostToast();
            },
          });
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};
