package com.braintrain.backend.configuration;

import com.braintrain.backend.model.Roadmap;
import com.braintrain.backend.model.RoadmapDTO;
import com.braintrain.backend.model.RoadmapMeta;
import com.braintrain.backend.repository.RoadmapMetaRepository;
import com.braintrain.backend.service.RoadmapService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.io.File;
import java.util.List;

@Configuration
public class DatabaseInitializer {

    private final MongoTemplate mongoTemplate;

    @Autowired
    public DatabaseInitializer(MongoTemplate mongoTemplate, RoadmapMetaRepository roadmapMetaRepository) {
        this.mongoTemplate = mongoTemplate;
    }

    @Bean
    CommandLineRunner initDatabase(RoadmapService service) {
        mongoTemplate.dropCollection(RoadmapMeta.class);
        mongoTemplate.dropCollection(Roadmap.class);
        return args -> {
            ObjectMapper objectMapper = new ObjectMapper();

            List<String> startingData = List.of("java", "python");

            for (String name : startingData) {
                String path = String.format("src/main/resources/%s.json", name);
                JsonNode jsonNode = objectMapper.readTree(new File(path));
                service.createRoadmap(new RoadmapDTO(name, objectMapper.writeValueAsString(jsonNode), "lukewilliams10101@gmail.com", "beginner", 50));
            }

        };
    }
}