-- CreateTable
CREATE TABLE "User" ("id" TEXT NOT NULL,"email" TEXT NOT NULL,"masterPasswordHash" TEXT NOT NULL,"failedAttempts" INTEGER NOT NULL DEFAULT 0,"lockedUntil" TIMESTAMP(3),"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "User_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Session" ("id" TEXT NOT NULL,"tokenHash" TEXT NOT NULL,"userId" TEXT NOT NULL,"expiresAt" TIMESTAMP(3) NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "Session_pkey" PRIMARY KEY ("id"));
CREATE TABLE "EmailAccount" ("id" TEXT NOT NULL,"userId" TEXT NOT NULL,"email" TEXT NOT NULL,"alias" TEXT,"provider" TEXT,"loginUrl" TEXT,"username" TEXT,"passwordEncrypted" TEXT,"twoFactorType" TEXT,"totpSecretEncrypted" TEXT,"recoveryCodesEncrypted" TEXT,"notesEncrypted" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,"lastUsedAt" TIMESTAMP(3),CONSTRAINT "EmailAccount_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Label" ("id" TEXT NOT NULL,"userId" TEXT NOT NULL,"name" TEXT NOT NULL,"color" TEXT NOT NULL DEFAULT '#64748b',CONSTRAINT "Label_pkey" PRIMARY KEY ("id"));
CREATE TABLE "EmailAccountLabel" ("emailAccountId" TEXT NOT NULL,"labelId" TEXT NOT NULL,CONSTRAINT "EmailAccountLabel_pkey" PRIMARY KEY ("emailAccountId","labelId"));
CREATE TABLE "AuditLog" ("id" TEXT NOT NULL,"userId" TEXT NOT NULL,"action" TEXT NOT NULL,"targetId" TEXT,"metadata" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE INDEX "Session_userId_expiresAt_idx" ON "Session"("userId", "expiresAt");
CREATE INDEX "EmailAccount_userId_email_idx" ON "EmailAccount"("userId", "email");
CREATE UNIQUE INDEX "Label_userId_name_key" ON "Label"("userId", "name");
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EmailAccount" ADD CONSTRAINT "EmailAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Label" ADD CONSTRAINT "Label_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EmailAccountLabel" ADD CONSTRAINT "EmailAccountLabel_emailAccountId_fkey" FOREIGN KEY ("emailAccountId") REFERENCES "EmailAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EmailAccountLabel" ADD CONSTRAINT "EmailAccountLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
