import ImportLog from "../models/ImportLog.js";


export const fetchImportLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [result, total] = await Promise.all([
      ImportLog.find()
        .sort({ createdAt: -1 })  
        .skip(skip)
        .limit(limit)
        .lean(),
      ImportLog.countDocuments()
    ]);

    res.status(200).json({
      message: "Successfully fetched logs",
      result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching logs:", error.message);
    res.status(500).json({
      message: "Error fetching logs",
      error: error.message
    });
  }
};
