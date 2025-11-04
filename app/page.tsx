"use client";

import { useEffect, useState } from "react";
import { HierarchyTree } from "@/components/HierarchyTree";

export default function HierarchyPage() {
  const [data, setData] = useState([]);

 

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:1234/api/hierarchy/getall");
      const json = await response.json();
      console.log(json.data);
      setData(json?.data);
    } catch (err) {
      console.error("Error fetching hierarchy data:", err);
    }
  };

  fetchData(); // <-- call the async function
}, []);


  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Organization Hierarchy</h1>
      <HierarchyTree data={data} />
    </main>
  );
}
