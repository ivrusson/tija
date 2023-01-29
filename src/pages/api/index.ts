import { NextTijaRequest, NextTijaResponse } from "@/core/types";

export default function handler(req: NextTijaRequest, res: NextTijaResponse) {
  res.status(200).json({
    message: 'OK'
  });
}
