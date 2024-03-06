import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";

const invoices = [
    {
      invoice: "Academic",
      paymentStatus: "", // empty string for unpaid
      totalAmount: "Mathematics", // random subject
      paymentMethod: "Credit Card",
    },
    {
      invoice: "School",
      paymentStatus: "Mrs. Smith", // random teacher name
      totalAmount: "", // empty string for no amount
      paymentMethod: "PayPal",
    },
    {
      invoice: "Academic",
      paymentStatus: "", // empty string for unpaid
      totalAmount: "Science", // random subject
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "School",
      paymentStatus: "Mr. Johnson", // random teacher name
      totalAmount: "History", // random subject
      paymentMethod: "Credit Card",
    },
    {
      invoice: "Academic",
      paymentStatus: "Mrs. Brown", // random teacher name
      totalAmount: "English", // random subject
      paymentMethod: "PayPal",
    },
    {
      invoice: "School",
      paymentStatus: "", // empty string for unpaid
      totalAmount: "Geography", // random subject
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "Academic",
      paymentStatus: "Mr. Davis", // random teacher name
      totalAmount: "Physical Education", // random subject
      paymentMethod: "Credit Card",
    },
  ];
  

const SurveyList = () => {
  return (
    <div className="mt-16">
      <Table>
        <TableCaption>Academic surveys</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Section</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="text-right">Answer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.totalAmount}</TableCell>
              <TableCell className="flex justify-end items-center">
                <Link href='/dashboard/dynamicsurveypage' className="mr-3">
                  <ArrowUpRightFromSquare className="stroke-zinc-900" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
    </div>
  );
};

export default SurveyList;
