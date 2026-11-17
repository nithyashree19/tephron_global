import { Navigate, Route, Routes, useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import DashboardPage from "./DashboardPage";
import BlogList from "./BlogList";
import PostForm from "./PostForm";
import JobsList from "./JobsList";
import JobForm from "./JobForm";
import GalleryList from "./GalleryList";
import GalleryForm from "./GalleryForm";
import ServicesList from "./ServicesList";
import ServiceForm from "./ServiceForm";

const EditPost = () => {
  const { slug } = useParams();
  return <PostForm key={slug} slug={slug} />;
};

const EditJob = () => {
  const { id } = useParams();
  return <JobForm key={id} id={id} />;
};

const NewPost = () => <PostForm />;
const NewJob = () => <JobForm />;

const EditPhoto = () => {
  const { id } = useParams();
  return <GalleryForm key={id} id={id} />;
};
const NewPhoto = () => <GalleryForm />;

const EditService = () => {
  const { slug } = useParams();
  return <ServiceForm key={slug} slug={slug} />;
};
const NewService = () => <ServiceForm />;

// No login yet: everything under /admin is open for now
const AdminApp = () => (
  <Routes>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="blog" element={<BlogList />} />
      <Route path="blog/new" element={<NewPost />} />
      <Route path="blog/:slug/edit" element={<EditPost />} />
      <Route path="jobs" element={<JobsList />} />
      <Route path="jobs/new" element={<NewJob />} />
      <Route path="jobs/:id/edit" element={<EditJob />} />
      <Route path="services" element={<ServicesList />} />
      <Route path="services/new" element={<NewService />} />
      <Route path="services/:slug/edit" element={<EditService />} />
      <Route path="gallery" element={<GalleryList />} />
      <Route path="gallery/new" element={<NewPhoto />} />
      <Route path="gallery/:id/edit" element={<EditPhoto />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Route>
  </Routes>
);

export default AdminApp;
