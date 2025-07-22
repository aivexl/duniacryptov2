import { FC } from "react";
interface NewsFeedProps {
  perPage: number;
  initialCount: number;
  loadMoreCount: number;
  showThumbnails: boolean;
  noTitle: boolean;
}
declare const NewsFeed: FC<NewsFeedProps>;
export default NewsFeed; 