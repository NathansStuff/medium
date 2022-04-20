export interface Post {
 _id: string;
 createdAt: string;
 title: string;
 author: {
  name: string;
  image: string;
 };
 descripion: string;
 mainImage: {
  asset: {
   url: string;
  };
 };
 slug: {
  currnet: string;
 };
 body: object[]
}