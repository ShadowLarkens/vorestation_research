/datum/research/New()		//Insert techs into possible_tech here. Known_tech automatically updated.
	if(!LAZYLEN(GLOB.design_datums))
		for(var/T in subtypesof(/datum/design))
			GLOB.design_datums += new T
		var/json = list()
		for(var/datum/design/D as anything in GLOB.design_datums)
			json += list(list(
				"name" = D.name,
				"desc" = D.desc,
				"item_name" = D.item_name,
				"id" = D.id,
				"req_tech" = D.req_tech,
				"build_type" = D.build_type,
				"materials" = D.materials,
				"chemicals" = D.chemicals,
				"build_path" = D.build_path,
				"time" = D.time,
				"category" = D.category,
				"sort_string" = D.sort_string,
				"search_metadata" = D.search_metadata,
			))
		rustg_file_append(json_encode(json), "research.json")
