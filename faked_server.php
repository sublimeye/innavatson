<?php

$id = $_POST['id'];
$query_string = "Wrong ID" + $id;

$date_start = $_POST['date_start'];
$date_finish = $_POST['date_finish'];

switch ($id) {
	case "10":

		$query_string = "
		{
			\"id\":\"20\",
			\"name\": \"Устройство 1\",
			\"date_start\":  \"1322321400000\",
			\"date_finish\": \"1322346600000\",
			\"notify\": {
				\"message\": \"\",
				\"date_start\": \"\",
				\"date_finish\": \"\"
			},
			\"periods\": [
				{\"type\": \"1\", \"start\": \"1322327801073\", \"finish\": \"1322329807073\"},
				{\"type\": \"1\", \"start\": \"1322330807073\", \"finish\": \"1322333807073\"},
				{\"type\": \"2\", \"start\": \"1322334807073\", \"finish\": \"1322343807073\"}
			]
		}";
	break;

	case "20":
		$query_string = "
		{
			\"id\":\"30\",
			\"name\": \"Устройство 2\",
			\"date_start\":  $date_start,
			\"date_finish\": $date_finish,
			\"notify\": {
				\"message\": \"Границы периодов активности\",
				\"date_start\": \"1322327400000\",
				\"date_finish\": \"\"
			},
			\"periods\": [
				{\"type\": \"1\", \"start\": \"1322327801073\", \"finish\": \"1322329807073\"},
				{\"type\": \"1\", \"start\": \"1322330807073\", \"finish\": \"1322333807073\"},
				{\"type\": \"2\", \"start\": \"1322334807073\", \"finish\": \"1322343807073\"}
			]
		}";
	break;

	case "30":
		$query_string = "
		{
			\"id\":\"50\",
			\"name\": \"Устройство 3\",
			\"date_start\":  $date_start,
			\"date_finish\": $date_finish,
			\"notify\": {
				\"message\": \"Границы периодов активности\",
				\"date_start\": \"1322325400000\",
				\"date_finish\": \"1322394200000\"
			},
			\"periods\": [
				{\"type\": \"1\", \"start\": \"1322327801073\", \"finish\": \"1322329807073\"},
				{\"type\": \"1\", \"start\": \"1322330807073\", \"finish\": \"1322333807073\"},
				{\"type\": \"2\", \"start\": \"1322334807073\", \"finish\": \"1322343807073\"}
			]
		}";
	break;

	default:
		$query_string = "
		{
			\"id\":\"100\",
			\"name\": \"Устройство 4\",
			\"date_start\":  $date_start,
			\"date_finish\": $date_finish,
			\"notify\": {
				\"message\": \"\",
				\"date_start\": \"\",
				\"date_finish\": \"\"
			},
			\"periods\": [
				{\"type\": \"1\", \"start\": \"1322327801073\", \"finish\": \"1322329807073\"},
				{\"type\": \"1\", \"start\": \"1322330807073\", \"finish\": \"1322333807073\"},
				{\"type\": \"2\", \"start\": \"1322334807073\", \"finish\": \"1322343807073\"}
			]
		}";
};

	echo $query_string;
?>
