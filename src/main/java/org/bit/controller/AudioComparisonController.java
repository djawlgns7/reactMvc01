package org.bit.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/audio")
public class AudioComparisonController {

    @PostMapping("/compare")
    public Map<String, Object> compareAudio(@RequestParam("file") MultipartFile file) throws IOException, InterruptedException {

        // 원본 파일과 Python 스크립트 경로를 동적으로 설정
        File originalFile = new ClassPathResource("music/original.mp3").getFile();
        File scriptFile = new ClassPathResource("python/compare_audio.py").getFile();

        // 업로드된 파일을 임시 디렉토리에 저장
        File uploadedFile = convertMultiPartToFile(file);

        // Python 스크립트 실행 인수 출력
        System.out.println("Executing Python script with the following parameters:");
        System.out.println("Python executable: python");
        System.out.println("Script path: " + scriptFile.getAbsolutePath());
        System.out.println("Original file path: " + originalFile.getAbsolutePath());
        System.out.println("Uploaded file path: " + uploadedFile.getAbsolutePath());

        // ProcessBuilder 설정
        ProcessBuilder processBuilder = new ProcessBuilder("python", scriptFile.getAbsolutePath(), originalFile.getAbsolutePath(), uploadedFile.getAbsolutePath());
        processBuilder.redirectErrorStream(true);

        // 환경 변수 출력
        Map<String, String> environment = processBuilder.environment();
        for (Map.Entry<String, String> entry : environment.entrySet()) {
            System.out.println("Environment variable: " + entry.getKey() + " = " + entry.getValue());
        }

        // 프로세스 시작 및 출력 읽기
        Process process = processBuilder.start();

        // Python 스크립트의 결과를 읽기
        BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String result;
        StringBuilder output = new StringBuilder();
        while ((result = in.readLine()) != null) {
            output.append(result);
        }

        // Python 스크립트의 표준 오류 출력 읽기
        BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        String errorLine;
        StringBuilder errorOutput = new StringBuilder();
        while ((errorLine = errorReader.readLine()) != null) {
            errorOutput.append(errorLine);
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            System.out.println("Python script exit code: " + exitCode);
            throw new IOException("Python script execution failed. Error: " + errorOutput.toString());
        }

        // 유사도 계산 결과
        double distance;
        try {
            distance = Double.parseDouble(output.toString().trim());
        } catch (NumberFormatException e) {
            throw new IOException("Failed to parse distance from Python script output: " + output.toString().trim());
        }
        double similarity = Math.max(0, 100 - distance); // 간단한 유사도 계산 예시

        Map<String, Object> response = new HashMap<>();
        response.put("distance", distance);
        response.put("similarity", similarity);
        return response;
    }

    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());
        file.transferTo(convFile);
        return convFile;
    }
}
