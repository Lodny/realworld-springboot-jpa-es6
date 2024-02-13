package com.lodny.realworldjuiceembeddable;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class RealworldJuiceEmbeddableApplication {

	public static void main(String[] args) {
		SpringApplication.run(RealworldJuiceEmbeddableApplication.class, args);
	}

}
