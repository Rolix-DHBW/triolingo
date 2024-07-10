import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { UrlObject } from "url";

export default function GutterlessList({ items }: GutterlessListProps) {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {items.map((item, index) => (
        <ListItem
          key={index}
          disableGutters
          secondaryAction={
            <IconButton aria-label="comment">
              <PostAddIcon />
            </IconButton>
          }
          sx={{
            border: "1px solid black",
            borderRadius: "4px",
            margin: "10px",
            padding: "24px",
            width: "100%",
          }}
        >
          {/* Wenn ein Bild-URL vorhanden ist, zeige ein Avatar-Bild an */}
          {item.imageUrl && (
            <ListItemAvatar>
              <Avatar alt={item.content} src={item.imageUrl} />
            </ListItemAvatar>
          )}
          {/* Zeige den Text des Listenelements an */}
          <ListItemText>
            <Link href={item.href} passHref legacyBehavior>
              <a style={{ textDecoration: "none", color: "inherit" }}>
                <Typography
                  variant="h6"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {item.content}
                </Typography>
              </a>
            </Link>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}
