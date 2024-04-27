import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { Heading } from "@chakra-ui/react";

function AdminDashboard() {
  return (
    <AdminMenu>
      <Heading size="md">Welcome to the Admin Dashboard</Heading>
    </AdminMenu>

  );
}

export default AdminDashboard;
