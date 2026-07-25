import express from "express";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
// app.use("/api", routes);

// app.use(notFoundHandler);

// app.use(errorHandler);
