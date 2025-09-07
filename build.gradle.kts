import io.github.andreabrighi.gradle.gitsemver.conventionalcommit.ConventionalCommit

plugins {
    base
    alias(libs.plugins.node)
    alias(libs.plugins.gitSemVer)
}


buildscript {
    dependencies {
        classpath("io.github.andreabrighi:conventional-commit-strategy-for-git-sensitive-semantic-versioning-gradle-plugin:1.0.15")
    }
}

gitSemVer {
    commitNameBasedUpdateStrategy(ConventionalCommit::semanticVersionUpdate)
    minimumVersion.set("0.1.0")
}

node {
    version.set("22.19.0")
    npmVersion.set("10.9.3")
    download.set(true)
    nodeProjectDir.set(file(project.projectDir))
}