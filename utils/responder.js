module.exports = function responder(req, res, next) {
  res.ok = (data, message = "OK", { raw = false } = {}) => {
    if (raw) {
      return res.status(200).json(data);
    }
    return res.status(200).json({ success: true, message, data });
  };
  res.created = (data, message = "Created", { raw = false } = {}) => {
    if (raw) {
      return res.status(201).json(data);
    }
    return res.status(201).json({ success: true, message, data });
  };
  res.badRequest = (data, message = "Bad Request") => {
    res.status(400).json({ success: false, message });
  };
  res.notFound = (message = "Not Found") => {
    res.status(404).json({ success: false, message });
  };
  next();
};
