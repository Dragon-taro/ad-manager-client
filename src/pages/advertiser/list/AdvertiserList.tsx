import React, { useState, useEffect, SyntheticEvent } from "react";
import { Header } from "../../../components/header/Header";
import { StandardLayout } from "../../../components/context/StandardLayout";
import { AdvertiserData } from "../../../context/types";
import { SessionRepository } from "../../../context/session";
import { useAxios } from "../../../context/axios";
import {
  TableContainer,
  Paper,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Table,
} from "@material-ui/core";
import { useHistory, Link } from "react-router-dom";
import { RegisterStickyButtons } from "../../../components/operations/RegisterStickyButtons";
import { TableSideOperations } from "../../../components/operations/TableSideOperations";

export function AdvertiserList() {
  const [advertisers, setAdvertisers] = useState<AdvertiserData[]>([]);
  const history = useHistory();
  const repository = SessionRepository();
  const session = repository.session();
  const axios = useAxios;

  useEffect(() => {
    const fetchAdvertiserData = async () => {
      const result = await axios(session).get("/advertisers");
      setAdvertisers(result.data);
    };
    fetchAdvertiserData();
  }, [axios, session]);

  function transitToRegisterPage() {
    history.push("/advertisers/register");
  }

  function transitToEditPage(e: SyntheticEvent, advertiser: AdvertiserData) {
    e.preventDefault();
    history.push(`/advertisers/${advertiser.id}/edit`);
  }

  async function removeAdvertiser(
    e: SyntheticEvent,
    advertiser: AdvertiserData
  ) {
    e.preventDefault();
    await axios(session)
      .delete(`/advertisers/${advertiser.id}`)
      .then((res) => {
        const result = advertisers.filter((item) => advertiser.id !== item.id);
        setAdvertisers(result);
      });
  }

  return (
    <>
      <Header />
      <StandardLayout title="広告主一覧">
        <RegisterStickyButtons onClick={transitToRegisterPage} />
        <TableContainer component={Paper}>
          <Table aria-label="table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>広告主名</TableCell>
                <TableCell>ドメイン</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {advertisers.map((advertiser) => (
                <TableRow key={advertiser.id}>
                  <TableCell>{advertiser.id}</TableCell>
                  <TableCell>
                    <Link to={`/advertisers/${advertiser.id}/view`}>
                      {advertiser.name}
                    </Link>
                  </TableCell>
                  <TableCell>{advertiser.domain}</TableCell>
                  <TableCell>
                    <TableSideOperations
                      entity={advertiser}
                      onEditClick={(e) => transitToEditPage(e, advertiser)}
                      onDeleteClick={(e) => removeAdvertiser(e, advertiser)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StandardLayout>
    </>
  );
}
