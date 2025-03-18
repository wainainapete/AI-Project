import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const Task = () => (
	<Routes>
		<Route path="*" element={<Navigate to="list" replace />} />
	</Routes>
);

export default Task;