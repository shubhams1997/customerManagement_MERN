const Series = require('../models/series');

exports.getSeriesById = (req, res, next, id) => {
	Series.findById(id).exec((err, series) => {
		if (err || !series) {
			return res.status(400).json({
				error: 'Series not Found'
			});
		}
		req.series = series;
		next();
	});
};

exports.createSeries = (req, res) => {
	const series = new Series(req.body);

	series.save((err, series) => {
		if (err) {
			return res.status(400).json({
				error: 'Failed to save series in DB'
			});
		}
		return res.json(series);
	});
};

exports.getAllSeries = (req, res) => {
	Series.find().exec((err, series) => {
		if (err) {
			return res.status(400).json({
				error: 'No Series Found!'
			});
		}
		return res.json(series);
	});
};

exports.updateSeries = (req, res) => {
	const series = req.series;
	series.name = req.body.name;
	series.save((err, series) => {
		if (err) {
			return res.status(400).json({
				error: 'Failed to Update Series'
			});
		}
		return res.json(series);
	});
};

exports.deleteSeries = (req, res) => {
	const series = req.series;
	series.remove((err, series) => {
		if (err) {
			return res.status(400).json({
				error: 'Failed to delete series'
			});
		}
		return res.json({
			message: `${series.name} deleted successfully!`
		});
	});
};
