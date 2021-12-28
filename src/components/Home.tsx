import { Box, Button, CircularProgress } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export interface Data {
    title: string;
    url: string;
    created_at: Date;
    author: string;
}

interface Column {
    id: "title" | "url" | "created_at" | "author";
    label: string;
    minWidth?: number;
    align?: "center";
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: "title", label: "title", minWidth: 170 },
    {id: "url", label: "url",minWidth: 170,align: "center"},
    {id: "created_at",label: "created_at",minWidth: 170, align: "center"},
    {id: "author",label: "author",minWidth: 170,align: "center"},
];

const Home: React.FC = () => {
    const history = useHistory();
    const [data, Setdata] = useState<Data[]>([]);
    const [loading, setloading] = useState<boolean>(false);
    const [totalData, settotalData] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [myInterval, setmyInterval] = useState<any>(null);

    useEffect(() => {
        getPost(0);
        const timer = setInterval(() => {
            getPost(0);
        }, 10000);

        setmyInterval(timer);

        return () => clearInterval(myInterval);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getPost = async (pageNumber: number) => {
        try {
            setloading(true);

            const res = await fetch(
                `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageNumber}`
            );
            const data = await res.json();
            Setdata(data.hits);
            settotalData(data.nbHits);

            setloading(false);
        } catch (err) {
            setloading(false);
            console.log(err);
        }
    };

    const handleChangePage = async(event: unknown, newPage: number) => {
        if (newPage === 0) {
            const timer = setInterval(() => {
                getPost(0);
            }, 10000);
            setmyInterval(timer);
        } else {
            clearInterval(myInterval);
        }
        setPage(newPage);
       await getPost(newPage);
    };

    const handleClick = (post: Data) => {
        history.push({
            pathname: "/details",
            state: post,
        });
    };
    return (
        <div>
            <h2>Home page</h2>

            {
                <Paper sx={{ width: "90%", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        {loading ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{
                                                    minWidth: column.minWidth,
                                                }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row, i) => {
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={i}
                                            >
                                                {columns.map((column) => {
                                                    const value =
                                                        row[column.id];
                                                    return (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                        >
                                                            {column.format &&
                                                            typeof value ===
                                                                "number"
                                                                ? column.format(
                                                                      value
                                                                  )
                                                                : value}
                                                        </TableCell>
                                                    );
                                                })}
                                                <TableCell>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        onClick={() =>
                                                            handleClick(row)
                                                        }
                                                    >
                                                        Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[]}
                        component="div"
                        count={totalData}
                        rowsPerPage={20}
                        page={page}
                        onPageChange={handleChangePage}
                    />
                </Paper>
            }
        </div>
    );
};

export default Home;
