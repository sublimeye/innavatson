<?php

$id = $_POST['id'];
$query_string = "Wrong ID" + $id;

$date_start = $_POST['date_start'];
$date_finish = $_POST['date_finish'];

switch ($id) {
	case "10":

		$query_string = '
		{
			"id":"77",
			"name": "Устройство 2",
			"date_start":  "1322326807073",
			"date_finish": "1322346807072",
			"notify": {
				"message": "Границы периодов активности",
				"date_start": "1322133967417",
				"date_finish": "1322263987518"
			},
			"periods": [
				{"type": "1", "start": "1322327801073", "finish": "1322329807073"},
				{"type": "1", "start": "1322330807073", "finish": "1322333807073"},
				{"type": "2", "start": "1322334807073", "finish": "1322343807073"}
			]
		}';
	break;

	case "20":
		$query_string = '
		{
			"id":"77",
			"name": "Устройство 5",
			"date_start":  "1322326807073",
			"date_finish": "1322346807072",
			"notify": {
				"message": "Границы периодов активности",
				"date_start": "",
				"date_finish": "1322263987518"
			},
			"periods": [
				{"type": "1", "start": "1322327801073", "finish": "1322329807073"},
				{"type": "1", "start": "1322330807073", "finish": "1322333807073"},
				{"type": "2", "start": "1322334807073", "finish": "1322343807073"}
			]
		}';
	break;

	default:
		$query_string = "
		{
			\"id\":\"77\",
			\"name\": \"Устройство 5\",
			\"date_start\":  $date_start,
			\"date_finish\": $date_finish,
			\"notify\": {
				\"message\": \"Границы периодов активности\",
				\"date_start\": \"1322262767518\",
				\"date_finish\": \"1322263987518\"
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
